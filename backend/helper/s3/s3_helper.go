package s3helper

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
)

type S3Helper struct {
	client *s3.Client
	bucket string
}

var S3Instance *S3Helper

type Config struct {
	AccessKeyID     string
	SecretAccessKey string
	Region          string
	BucketName      string
}

func NewS3Helper(cfg Config) (*S3Helper, error) {
	awsCfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(cfg.Region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AccessKeyID,
			cfg.SecretAccessKey,
			"",
		)),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg)

	helper := &S3Helper{
		client: client,
		bucket: cfg.BucketName,
	}

	return helper, nil
}

func InitializeS3() {
	cfg := Config{
		AccessKeyID:     os.Getenv("ACCESSKEYID"),
		SecretAccessKey: os.Getenv("SECRETACCESSKEY"),
		Region:          os.Getenv("REGION"),
		BucketName:      os.Getenv("BUCKETNAME"),
	}
	var err error
	S3Instance, err = NewS3Helper(cfg)

	if err != nil {
		log.Fatalf("Failed to initialize S3: %v", err)
	}
}

func (h *S3Helper) GenerateFileName(originalFileName string) string {
	ext := filepath.Ext(originalFileName)
	if ext == "" {
		ext = ".jpg"
	}

	uniqueID := uuid.New().String()

	timestamp := time.Now().Format("2006-01-02_15-04-05")

	fileName := fmt.Sprintf("%s_%s%s", timestamp, uniqueID, ext)

	return fileName
}

func (h *S3Helper) GenerateFileNameWithFolder(folder, originalFileName string) string {
	fileName := h.GenerateFileName(originalFileName)

	folder = strings.Trim(folder, "/")
	if folder != "" {
		return fmt.Sprintf("%s/%s", folder, fileName)
	}

	return fileName
}

func (h *S3Helper) UploadPicture(ctx context.Context, key string, body io.Reader, contentType string) error {
	if contentType == "" {
		contentType = "image/jpeg"
	}

	_, err := h.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(h.bucket),
		Key:         aws.String(key),
		Body:        body,
		ContentType: aws.String(contentType),
	})

	if err != nil {
		return fmt.Errorf("failed to upload picture: %w", err)
	}

	return nil
}

func (h *S3Helper) UploadPictureWithMetadata(ctx context.Context, key string, body io.Reader, contentType string, metadata map[string]string) error {
	if contentType == "" {
		contentType = "image/jpeg"
	}

	_, err := h.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(h.bucket),
		Key:         aws.String(key),
		Body:        body,
		ContentType: aws.String(contentType),
		Metadata:    metadata,
		ACL:         types.ObjectCannedACLPublicRead,
	})

	if err != nil {
		return fmt.Errorf("failed to upload picture with metadata: %w", err)
	}

	return nil
}

func (h *S3Helper) GetPicture(ctx context.Context, key string) (io.ReadCloser, error) {
	result, err := h.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(h.bucket),
		Key:    aws.String(key),
	})

	if err != nil {
		return nil, fmt.Errorf("failed to get picture: %w", err)
	}

	return result.Body, nil
}

func (h *S3Helper) GetPictureURL(key string) string {
	return fmt.Sprintf("https://%s.s3.amazonaws.com/%s", h.bucket, key)
}

func (h *S3Helper) GetPictureMetadata(ctx context.Context, key string) (map[string]string, error) {
	result, err := h.client.HeadObject(ctx, &s3.HeadObjectInput{
		Bucket: aws.String(h.bucket),
		Key:    aws.String(key),
	})

	if err != nil {
		return nil, fmt.Errorf("failed to get picture metadata: %w", err)
	}

	return result.Metadata, nil
}

func (h *S3Helper) DeletePicture(ctx context.Context, key string) error {
	_, err := h.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(h.bucket),
		Key:    aws.String(key),
	})

	if err != nil {
		return fmt.Errorf("failed to delete picture: %w", err)
	}

	return nil
}
